export const HeroScreen = ({ children, height }) => {
  return (
    <div
      className={`h-screen bg-cover bg-center grid items-center text-center sm:h-[${height}vh]`}
      style={{ backgroundImage: `url('/ClientImages/main.jpg')` }}
    >
      <div className={`absolute h-full inset-0 bg-overlay`}></div>
      <div className="z-20 drop-shadow-lg grid gap-3 place-items-center mx-auto text-primary w-fit">
        {children}
      </div>
    </div>
  );
};
