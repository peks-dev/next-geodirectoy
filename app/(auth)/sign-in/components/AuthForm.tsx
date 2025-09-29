'use client';

import React from 'react';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { useAuthTimer } from '../hooks/useAuthTimer';
import HeaderContainer from '@/components/ui/Header';
import EmailForm from './EmailForm';
import CodeVerificationForm from './CodeVerificationForm';
import ExpiredCodeMessage from './ExpiredCodeMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Multi-step authentication form that handles OTP-based login/registration
 * States: idle → code_sent → success (or expired/error)
 */

export default function AuthForm() {
  const {
    state,
    email,
    otp,
    loading,
    sendOTP,
    verifyOTP,
    resetFlow,
    setExpired,
    handleEmailChange,
    handleOtpChange,
  } = useAuthFlow();

  const { timeLeft, startTimer, resetTimer, clearTimer, formatTime } =
    useAuthTimer();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendOTP();
    if (success) {
      resetTimer(600);
      startTimer(() => setExpired());
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOTP();
    if (success) {
      clearTimer(); // Stop timer on successful verification
    }
  };

  const handleResendCode = async () => {
    const success = await sendOTP(true);
    if (success) {
      resetTimer(600); // Reset to full 10 minutes on resend
      startTimer(() => setExpired());
    }
  };

  const handleResetFlow = () => {
    clearTimer();
    resetFlow();
  };

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
