// src/components/layout/BaseSubmenu.tsx
interface SubmenuConfig {
  title: string;
  logo: string;
  items: { label: string; href: string; }[];
  actions: string[];
}

interface BaseSubmenuProps {
  config: SubmenuConfig;
  currentPath: string;
}

export default function BaseSubmenu({ config, currentPath }: BaseSubmenuProps) {
  return (
    <div>
      <h2>{config.title}</h2>
      <img src={config.logo} alt={config.title} />
      <nav>
        {config.items.map((item, index) => (
          <a 
            key={index} 
            href={item.href}
            className={currentPath === item.href ? 'active' : ''}
          >
            {item.label}
          </a>
        ))}
      </nav>
      {/* Handle actions */}
      {config.actions.map((action, index) => (
        <button key={index}>{action}</button>
      ))}
    </div>
  );
}