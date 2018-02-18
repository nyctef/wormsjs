export interface KeyboardInputComponent {
  left: boolean;
  right: boolean;
  jump: boolean;
  fire: boolean;
}

export const newKeyboardInputComponent = (): KeyboardInputComponent => {
  return {
    left: false,
    right: false,
    jump: false,
    fire: false
  };
};
