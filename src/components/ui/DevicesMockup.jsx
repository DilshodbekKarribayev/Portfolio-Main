const DEVICE_MAP = {
  iphone: { className: 'device-iphone-14-pro', width: 428, height: 868 },
  ipad: { className: 'device-ipad-pro', width: 560, height: 778 },
  macbook: { className: 'device-macbook-pro-2018', width: 740, height: 444 },
}

function DevicesMockup({
  device = 'iphone',
  src,
  scale = 0.3,
  color = '',
  className = '',
  children,
}) {
  const config = DEVICE_MAP[device] || DEVICE_MAP.iphone
  const scaledWidth = Math.round(config.width * scale)
  const scaledHeight = Math.round(config.height * scale)
  const colorClass = color ? `device-${color}` : ''

  return (
    <div
      className={`relative ${className}`}
      style={{ width: scaledWidth, height: scaledHeight }}
    >
      <div
        className="absolute left-0 top-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className={`device ${config.className} ${colorClass}`}>
          <div className="device-frame">
            {children ? (
              <div className="device-screen overflow-hidden">{children}</div>
            ) : (
              <div className="device-screen flex items-center justify-center bg-zinc-900 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {src ? 'Image pending' : 'Placeholder'}
              </div>
            )}
          </div>
          <div className="device-stripe" />
          <div className="device-header" />
          <div className="device-sensors" />
          <div className="device-btns" />
          <div className="device-power" />
          <div className="device-home" />
        </div>
      </div>
    </div>
  )
}

export default DevicesMockup
