import React, { useRef } from 'react';

interface SignUpProps {
  onSubmit: (formData: SignUpForm) => void;
}

interface SignUpForm {
  useremail: string;
  nickname: string;
  password: string;
}

export default function SignUp({ onSubmit }: SignUpProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const useremailRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const submitForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const useremail = useremailRef.current?.value;
    const nickname = nicknameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!useremail || !nickname || !password) {
      alert('폼을 모두 채워주세요.');
      return;
    }

    if (confirmPassword !== password) {
      confirmPasswordRef.current?.setCustomValidity('Different from password');
      confirmPasswordRef.current?.reportValidity();
      return;
    } else {
      confirmPasswordRef.current?.setCustomValidity(''); // 이전 검증 상태 초기화
    }

    const formData = {
      useremail,
      nickname,
      password,
    };

    onSubmit(formData);
    // formRef.current.reset();
  };

  return (
    <>
      <form ref={formRef}>
        <input
          ref={useremailRef}
          placeholder="Email"
          autoComplete="off"
          required
        />
        <input
          type="Nickname"
          ref={nicknameRef}
          placeholder="Nickname"
          autoComplete="off"
          required
        />

        <input
          id="password"
          type="password"
          ref={passwordRef}
          placeholder="Password"
          required
        />

        <input
          type="password"
          ref={confirmPasswordRef}
          placeholder="Confirm Password"
          required
        />
        <button onClick={submitForm}>회원가입</button>
      </form>
    </>
  );
}