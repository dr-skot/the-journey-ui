import React from "react";

interface ChatMessageProps {
  name: string,
  text: string,
}

export default function ChatMessage({ name, text }: ChatMessageProps) {
  return (
    <div>
    <b>name</b>
    <span>text</span>
    </div>
  );
}
