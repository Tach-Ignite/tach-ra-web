export type CounterBubbleProps = {
  quantity: number;
};

function CounterBubble({ quantity }: CounterBubbleProps) {
  return (
    <div className="text-xs font-semibold rounded-full bg-tachPurple w-4 h-4 text-center ">
      {quantity}
    </div>
  );
}

export default CounterBubble;
