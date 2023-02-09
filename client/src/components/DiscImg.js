export default function DiscItem({src}) {
  return (
    <img className="card-img" src={src ? src : "/images/missing-disc.png"}/>
  );
} 