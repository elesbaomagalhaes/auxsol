'use client';

import React from 'react';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Utilitários para notificações toast customizadas
 */
export const toastNotifications = {
  /**
   * Toast de sucesso
   */
  success: ({ title = 'Sucesso', description, duration = 4000, action }: ToastOptions = {}) => {
    return toast.success(title, {
      description,
      duration,
      action,
      icon: <CheckCircle className="h-4 w-4" />
    });
  },

  /**
   * Toast de erro
   */
  error: ({ title = 'Erro', description, duration = 6000, action }: ToastOptions = {}) => {
    return toast.error(title, {
      description,
      duration,
      action,
      icon: <XCircle className="h-4 w-4" />
    });
  },

  /**
   * Toast de aviso
   */
  warning: ({ title = 'Atenção', description, duration = 5000, action }: ToastOptions = {}) => {
    return toast.warning(title, {
      description,
      duration,
      action,
      icon: <AlertCircle className="h-4 w-4" />
    });
  },

  /**
   * Toast informativo
   */
  info: ({ title = 'Informação', description, duration = 4000, action }: ToastOptions = {}) => {
    return toast.info(title, {
      description,
      duration,
      action,
      icon: <Info className="h-4 w-4" />
    });
  },

  /**
   * Toast de carregamento
   */
  loading: ({ title = 'Carregando...', description }: Pick<ToastOptions, 'title' | 'description'> = {}) => {
    return toast.loading(title, {
      description
    });
  },


};