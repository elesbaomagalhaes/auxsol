/**
 * Cache inteligente para resultados de geocodificação
 * Implementa TTL, limpeza automática e gerenciamento de memória
 */

interface CacheEntry<T> {
  result: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export class GeocodingCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly TTL: number;
  private readonly MAX_SIZE: number;
  private stats = { hits: 0, misses: 0 };
  private cleanupInterval: NodeJS.Timeout | null = null;
  
  constructor(
    ttlMs: number = 24 * 60 * 60 * 1000, // 24 horas por padrão
    maxSize: number = 1000 // Máximo 1000 entradas
  ) {
    this.TTL = ttlMs;
    this.MAX_SIZE = maxSize;
    this.startCleanupInterval();
  }
  
  /**
   * Recupera um item do cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Verificar se expirou
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    
    return entry.result;
  }
  
  /**
   * Armazena um item no cache
   */
  set(key: string, value: T): void {
    // Verificar se precisa fazer limpeza por tamanho
    if (this.cache.size >= this.MAX_SIZE) {
      this.evictLeastUsed();
    }
    
    const entry: CacheEntry<T> = {
      result: value,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now()
    };
    
    this.cache.set(key, entry);
  }
  
  /**
   * Remove um item específico do cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  /**
   * Limpa todo o cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }
  
  /**
   * Retorna estatísticas do cache
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0
    };
  }
  
  /**
   * Gera uma chave de cache normalizada para endereços
   */
  static generateAddressKey(address: string, region?: string): string {
    const normalized = address
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Normalizar espaços
      .replace(/[.,;]/g, '') // Remover pontuação
      .replace(/\b(rua|av|avenida|r\.|av\.)\b/g, '') // Normalizar prefixos
      .trim();
    
    return region ? `${normalized}|${region.toLowerCase()}` : normalized;
  }
  
  /**
   * Gera uma chave de cache para coordenadas
   */
  static generateCoordinateKey(lat: number, lng: number, precision: number = 4): string {
    const roundedLat = Number(lat.toFixed(precision));
    const roundedLng = Number(lng.toFixed(precision));
    return `${roundedLat},${roundedLng}`;
  }
  
  /**
   * Verifica se uma entrada expirou
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.TTL;
  }
  
  /**
   * Remove entradas expiradas
   */
  private cleanupExpired(): number {
    let removedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
        removedCount++;
      }
    }
    
    return removedCount;
  }
  
  /**
   * Remove as entradas menos usadas quando o cache está cheio
   */
  private evictLeastUsed(): void {
    if (this.cache.size === 0) return;
    
    // Encontrar a entrada menos usada (menor accessCount, depois mais antiga)
    let leastUsedKey: string | null = null;
    let leastUsedEntry: CacheEntry<T> | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      if (!leastUsedEntry || 
          entry.accessCount < leastUsedEntry.accessCount ||
          (entry.accessCount === leastUsedEntry.accessCount && 
           entry.lastAccessed < leastUsedEntry.lastAccessed)) {
        leastUsedKey = key;
        leastUsedEntry = entry;
      }
    }
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }
  
  /**
   * Inicia o intervalo de limpeza automática
   */
  private startCleanupInterval(): void {
    // Limpeza a cada 30 minutos
    this.cleanupInterval = setInterval(() => {
      const removed = this.cleanupExpired();
      if (removed > 0) {
        console.log(`[GeocodingCache] Limpeza automática: ${removed} entradas removidas`);
      }
    }, 30 * 60 * 1000);
  }
  
  /**
   * Para o intervalo de limpeza (importante para testes)
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Instância singleton para uso global
export const geocodingCache = new GeocodingCache();