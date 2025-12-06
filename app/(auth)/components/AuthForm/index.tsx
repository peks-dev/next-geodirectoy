'use client';
import React, { useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAuthFlow } from '@/auth/hooks/useAuthFlow';
import HeaderContainer from '@/components/ui/Header';
import EmailForm from './components/EmailForm';
import CodeVerificationForm from './components/CodeVerificationForm';
import ExpiredCodeMessage from './components/ExpiredCodeMessage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SuccessIcon } from '@/app/components/ui/svgs';
import IconBox from '@/app/components/ui/IconBox';

export default function AuthForm() {
  const {
    state,
    email,
    otp,
    loading,
    handleSendOTP,
    handleVerifyOTP,
    handleResendCode,
    handleResetFlow,
    handleEmailChange,
    handleOtpChange,
    timeLeft,
  } = useAuthFlow();

  // Referencias
  const wrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const verificationFormRef = useRef<HTMLDivElement>(null);
  const expiredMessageRef = useRef<HTMLDivElement>(null);
  const loadingSpinnerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const prevStateRef = useRef(state);
  const isMountedRef = useRef(false);

  const isCodeVerificationVisible =
    state === 'code_sent' || state === 'verifying';

  // Función para obtener el título según el estado
  const getTitle = useCallback(() => {
    switch (state) {
      case 'idle':
      case 'error':
        return 'inicia sesión o registrate';
      case 'code_sent':
        return 'revisa tu correo';
      case 'verifying':
        return 'verificando tu código...';
      case 'success':
        return '¡bienvenido!';
      case 'expired':
        return 'codigo expirado';
      default:
        return 'cargando...';
    }
  }, [state]);

  // Animación inicial de entrada con DELAY
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const header = headerRef.current;
    const container = containerRef.current;

    if (!header || !container || !wrapper || isMountedRef.current) return;

    gsap.set(wrapper, { opacity: 0 });
    isMountedRef.current = true;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(wrapper, { opacity: 1, duration: 0.1 });

    tl.fromTo(
      header,
      { opacity: 0, x: -15 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power2.out',
        onStart: () => {
          gsap.to(header, {
            x: '+=3',
            duration: 0.08,
            repeat: 3,
            yoyo: true,
            ease: 'power1.inOut',
          });
        },
      },
      '-=0.05'
    );

    tl.fromTo(
      container,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    );
  }, []);

  // Efecto Matrix para el header - transición de texto con caracteres aleatorios
  const applyMatrixEffect = (element: HTMLElement, targetText: string) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    const originalText = element.textContent || '';
    const maxLength = Math.max(originalText.length, targetText.length);

    let frame = 0;
    const totalFrames = 20; // Número de iteraciones

    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        element.textContent = targetText;
        clearInterval(interval);
        return;
      }

      let newText = '';
      for (let i = 0; i < maxLength; i++) {
        // Progresivamente revela las letras correctas
        const progress = frame / totalFrames;
        const revealThreshold = i / maxLength;

        if (progress > revealThreshold && i < targetText.length) {
          newText += targetText[i];
        } else if (i < targetText.length) {
          // Muestra caracteres aleatorios
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = newText;
      frame++;
    }, 30); // 30ms entre frames = ~33fps
  };

  // Animación del cambio de título
  useEffect(() => {
    const header = headerRef.current;
    if (!header || !isMountedRef.current) return;

    const stateChanged = prevStateRef.current !== state;
    if (!stateChanged) return;

    const newTitle = getTitle();
    applyMatrixEffect(header, newTitle);
  }, [state, getTitle]);

  // MEGA useEffect - Maneja TODAS las transiciones de estado
  useEffect(() => {
    if (!isMountedRef.current) return;

    const container = containerRef.current;
    const verificationForm = verificationFormRef.current;
    const expiredMessage = expiredMessageRef.current;
    const loadingSpinner = loadingSpinnerRef.current;
    const successIcon = successRef.current;

    if (!container) return;

    const prevState = prevStateRef.current;
    const currentState = state;

    if (prevState === currentState) return;

    // Función helper para ocultar elemento (sin ocupar espacio)
    const hideElement = (element: HTMLElement) => {
      gsap.set(element, {
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
        opacity: 0,
      });
    };

    // Función helper para mostrar elemento (ocupa espacio normal)
    const showElement = (element: HTMLElement) => {
      gsap.set(element, {
        position: 'relative',
        visibility: 'visible',
        pointerEvents: 'auto',
      });
    };

    // Función helper para medir altura
    const measureHeight = (element: HTMLElement) => {
      gsap.set(container, { height: 'auto' });
      gsap.set(element, { position: 'relative', visibility: 'visible' });
      const height = container.scrollHeight;
      return height;
    };

    // Función helper para animar altura
    const animateHeight = (
      fromHeight: number,
      toHeight: number,
      onComplete?: () => void
    ) => {
      gsap.set(container, { height: fromHeight });
      gsap.to(container, {
        height: toHeight,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(container, { height: 'auto' });
          onComplete?.();
        },
      });
    };

    // TRANSICIÓN: idle/error → code_sent
    if (
      (prevState === 'idle' || prevState === 'error') &&
      currentState === 'code_sent'
    ) {
      const currentHeight = container.offsetHeight;

      gsap.set(verificationForm, { opacity: 0, y: 30 });
      showElement(verificationForm!);
      const newHeight = measureHeight(verificationForm!);
      gsap.set(verificationForm, { opacity: 0 });

      animateHeight(currentHeight, newHeight);

      gsap.to(verificationForm, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        delay: 0.1,
        ease: 'power2.out',
      });
    }

    // TRANSICIÓN: code_sent → idle (cambiar email)
    else if (prevState === 'code_sent' && currentState === 'idle') {
      hideElement(verificationForm!);
      gsap.to(container, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // TRANSICIÓN: code_sent → verifying
    else if (prevState === 'code_sent' && currentState === 'verifying') {
      hideElement(verificationForm!);

      if (loadingSpinner) {
        showElement(loadingSpinner);
        gsap.set(loadingSpinner, { opacity: 0, scale: 0.8 });
        gsap.to(loadingSpinner, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.5)',
        });
      }

      gsap.to(container, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // TRANSICIÓN: verifying → code_sent (código incorrecto)
    else if (prevState === 'verifying' && currentState === 'code_sent') {
      if (loadingSpinner) {
        hideElement(loadingSpinner);
      }

      // El CodeVerificationForm vuelve a aparecer
      if (verificationForm) {
        showElement(verificationForm);
        gsap.set(verificationForm, { opacity: 1, y: 0 });
      }

      gsap.to(container, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // TRANSICIÓN: verifying → success
    else if (prevState === 'verifying' && currentState === 'success') {
      if (loadingSpinner) {
        hideElement(loadingSpinner);
      }

      if (successIcon) {
        showElement(successIcon);
        gsap.set(successIcon, { opacity: 0, scale: 0.5 });
        gsap.to(successIcon, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.6)',
        });
      }

      gsap.to(container, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // TRANSICIÓN: code_sent/verifying → expired
    else if (
      (prevState === 'code_sent' || prevState === 'verifying') &&
      currentState === 'expired'
    ) {
      const currentHeight = container.offsetHeight;

      // Ocultar todo lo anterior
      if (verificationForm) hideElement(verificationForm);
      if (loadingSpinner) hideElement(loadingSpinner);

      // Shake del container
      gsap.to(container, {
        x: 5,
        duration: 0.08,
        repeat: 7,
        yoyo: true,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.set(container, { x: 0 });
        },
      });

      if (expiredMessage) {
        gsap.set(expiredMessage, { opacity: 0, y: 20 });
        showElement(expiredMessage);
        const newHeight = measureHeight(expiredMessage);
        gsap.set(expiredMessage, { opacity: 0 });

        animateHeight(currentHeight, newHeight);

        gsap.to(expiredMessage, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          delay: 0.15,
          ease: 'power2.out',
        });
      }
    }

    // TRANSICIÓN: expired → code_sent (reenviar código)
    else if (prevState === 'expired' && currentState === 'code_sent') {
      const currentHeight = container.offsetHeight;

      if (expiredMessage) {
        hideElement(expiredMessage);
      }

      if (verificationForm) {
        gsap.set(verificationForm, { opacity: 0, y: 30 });
        showElement(verificationForm);
        const newHeight = measureHeight(verificationForm);
        gsap.set(verificationForm, { opacity: 0 });

        animateHeight(currentHeight, newHeight);

        gsap.to(verificationForm, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          delay: 0.1,
          ease: 'power2.out',
        });
      }
    }

    // TRANSICIÓN: expired → idle (cambiar email)
    else if (prevState === 'expired' && currentState === 'idle') {
      if (expiredMessage) {
        hideElement(expiredMessage);
      }

      gsap.to(container, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    // TRANSICIÓN: success → idle
    else if (prevState === 'success' && currentState === 'idle') {
      if (successIcon) {
        hideElement(successIcon);
      }

      gsap.to(container, {
        height: 'auto',
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }

    prevStateRef.current = state;
  }, [state]);

  const renderContent = () => {
    if (state === 'success') {
      return (
        <div ref={successRef} className="flex items-center justify-center">
          <IconBox icon={<SuccessIcon />} size="xl" className="text-success" />
        </div>
      );
    }

    if (state === 'verifying') {
      return (
        <div ref={loadingSpinnerRef}>
          <LoadingSpinner message="analizando código..." />
        </div>
      );
    }

    if (state === 'expired') {
      return (
        <div ref={expiredMessageRef}>
          <ExpiredCodeMessage onResendCode={handleResendCode} />
        </div>
      );
    }

    return (
      <div className="relative">
        <div>
          <EmailForm
            email={email}
            loading={loading}
            onEmailChange={handleEmailChange}
            onSubmit={handleSendOTP}
            isCollapsed={isCodeVerificationVisible}
            onShowEmailForm={handleResetFlow}
          />
        </div>
        <div
          ref={verificationFormRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            opacity: 0,
          }}
        >
          <CodeVerificationForm
            otp={otp}
            loading={loading}
            onOtpChange={handleOtpChange}
            onSubmit={handleVerifyOTP}
            onResendCode={handleResendCode}
            timeLeft={timeLeft}
          />
        </div>
      </div>
    );
  };

  return (
    <div ref={wrapperRef} className="w-md space-y-6">
      <HeaderContainer>
        <h1
          ref={headerRef}
          className="heading text-foreground-accent text-neon-accent text-sm"
        >
          {getTitle()}
        </h1>
      </HeaderContainer>
      <div
        ref={containerRef}
        className="transparent-container p-md"
        style={{ overflow: 'hidden' }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
