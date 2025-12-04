'use client';

import React from 'react';
import { useAuthFlow } from '@/auth/hooks/useAuthFlow';
import HeaderContainer from '@/components/ui/Header';
import EmailForm from './components/EmailForm';
import CodeVerificationForm from './components/CodeVerificationForm';
import ExpiredCodeMessage from './components/ExpiredCodeMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Authentication form component that handles UI logic
 * Business logic is handled by the useAuthFlow hook
 */
export default function AuthForm() {
  const {
    state,
    email,
    otp,
    loading,
    timeLeft,
    handleSendOTP,
    handleVerifyOTP,
    handleResendCode,
    handleResetFlow,
    handleEmailChange,
    handleOtpChange,
    formatTime,
  } = useAuthFlow();

  const getTitle = () => {
    switch (state) {
      case 'idle':
      case 'error':
        return 'inicia sesión o registrate';
      case 'code_sent':
        return 'revisa tu correo';
      case 'success':
        return '¡bienvenido!';
      default:
        return 'verificando...';
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'idle':
      case 'error':
        return (
          <EmailForm
            email={email}
            loading={loading}
            onEmailChange={handleEmailChange}
            onSubmit={handleSendOTP}
          />
        );
      case 'code_sent':
        return (
          <CodeVerificationForm
            email={email}
            otp={otp}
            loading={loading}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onOtpChange={handleOtpChange}
            onSubmit={handleVerifyOTP}
            onResendCode={handleResendCode}
            onResetFlow={handleResetFlow}
          />
        );
      case 'expired':
        return <ExpiredCodeMessage onResetFlow={handleResetFlow} />;
      case 'success':
        return <LoadingSpinner message="analizando código..." />;
      case 'verifying':
        return <LoadingSpinner />;
      default:
        return null;
    }
  };

  return (
    <div className="w-md space-y-6">
      <HeaderContainer>
        <h1 className="heading text-foreground-accent text-neon-accent text-sm">
          {getTitle()}
        </h1>
      </HeaderContainer>
      <div className="transparent-container p-md">{renderContent()}</div>
    </div>
  );
}
