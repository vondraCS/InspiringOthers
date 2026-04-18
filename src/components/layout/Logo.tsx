import { cn } from '@/lib/utils';

const STROKE_PROPS_BASE = {
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeWidth: 70,
};

function LogoIcon({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Upper arc */}
      <path
        {...STROKE_PROPS_BASE}
        fillRule="evenodd"
        stroke={color}
        strokeMiterlimit={100}
        d="m161.25 698.87c-152.05-344.77 132.16-583.37 352.25-583.37 137 0 286.59 70.82 329.22 174.05"
      />
      {/* Lower arc */}
      <path
        {...STROKE_PROPS_BASE}
        fillRule="evenodd"
        stroke={color}
        strokeMiterlimit={100}
        d="m910.76 517.89c-6.32 183.63-149.39 333.88-292.42 372.27-132.32 35.52-295.15 5.9-363.09-82.75"
      />
      {/* Arm / horizontal stroke */}
      <path {...STROKE_PROPS_BASE} stroke={color} strokeMiterlimit={100} d="m792 512h195" />
      {/* Filled eye */}
      <path
        fillRule="evenodd"
        fill={color}
        d="m373.03 600.14c-42.48 11.38-87.68-19.93-101.11-70.06-13.43-50.13 10.05-99.85 52.53-111.23 42.48-11.38 87.67 19.93 101.1 70.06 13.44 50.13-10.04 99.85-52.52 111.23z"
      />
      {/* Ear curl */}
      <path
        {...STROKE_PROPS_BASE}
        stroke={color}
        strokeLinejoin="round"
        d="m688 350c-57.46 19.29-103.01 62.55-125 116 44.77-19.85 85.19-21.56 122.76-7.33"
      />
    </svg>
  );
}

type LogoProps = {
  size?: 'sm' | 'lg';
  /** 'green' for use on white backgrounds; 'black' for use on the green sidebar */
  color?: 'green' | 'black';
  className?: string;
};

export function Logo({ size = 'sm', color = 'green', className }: LogoProps) {
  const textClass = size === 'lg' ? 'text-[48px]' : 'text-[22px]';
  const iconClass = size === 'lg' ? 'w-[52px] h-[52px]' : 'w-[24px] h-[24px]';
  const iconColor = color === 'green' ? '#2ecb71' : 'black';
  const textColor = color === 'green' ? 'text-black' : 'text-black';

  return (
    <div className={cn('flex items-center font-raleway font-bold', textColor, className)}>
      <span className={textClass}>Inspiring</span>
      <LogoIcon color={iconColor} className={iconClass} />
      <span className={textClass}>thers</span>
    </div>
  );
}
