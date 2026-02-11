export function TextureOverlay() {
  return (
    <>
      <div className='texture-overlay' />
      {/* SVG Filters for ink bleed effect */}
      <svg className='svg-filters'>
        <defs>
          <filter id='ink-filter'>
            <feMorphology operator='dilate' radius='1' in='SourceGraphic' result='dilated' />
            <feGaussianBlur stdDeviation='0.5' in='dilated' result='blurred' />
            <feComposite operator='in' in='SourceGraphic' in2='blurred' result='composite' />
          </filter>
        </defs>
      </svg>
    </>
  );
}
