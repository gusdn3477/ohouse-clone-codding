// Input 컴포넌트 사용 예시

import Input from '@/components/Input';
import { useState } from 'react';

export default function InputExamples() {
    const [searchQuery, setSearchQuery] = useState('');
    const [email, setEmail] = useState('');

    return (
        <div className="space-y-6 p-8">
            {/* 검색 Input - leftIcon */}
            <Input
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                }
                clearable
                onClear={() => setSearchQuery('')}
                fullWidth
            />

            {/* 이메일 Input - label, error, helperText */}
            <Input
                label="이메일"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email && !email.includes('@') ? '유효한 이메일을 입력하세요' : undefined}
                helperText="로그인에 사용할 이메일을 입력하세요"
                clearable
                onClear={() => setEmail('')}
                fullWidth
            />

            {/* 비밀번호 Input - rightIcon */}
            <Input
                label="비밀번호"
                type="password"
                placeholder="비밀번호를 입력하세요"
                rightIcon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                }
                fullWidth
            />
        </div>
    );
}
