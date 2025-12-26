interface AdSlotProps {
  id: string;
  className?: string;
}

const AdSlot = ({ id, className = "" }: AdSlotProps) => {
  return (
    <section className={`container py-4 ${className}`}>
      <div 
        id={id}
        className="ad-slot h-[100px]"
        aria-label="Advertisement"
      >
        <span className="text-xs uppercase tracking-wider">Ad Slot</span>
      </div>
    </section>
  );
};

export default AdSlot;
