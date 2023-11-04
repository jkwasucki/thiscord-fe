export const playSound = (soundFile:string,volume?:number) => {
    const audio = new Audio(soundFile);
    volume && (audio.volume = volume)
    audio.play();
  };