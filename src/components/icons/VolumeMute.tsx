import * as React from 'react';

function VolumeMute(props: any) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 128 128" preserveAspectRatio="xMidYMid" {...props}>
      <path
        d="M127.993 83.387l-5.278 5.279-20.53-20.559L81.62 88.672l-5.233-5.292 20.55-20.522L76.38 42.3l5.248-5.248 20.557 20.558 20.522-20.551L128 42.293l-20.565 20.565 20.558 20.53zM0 85.607V40.118h21.24l39.41-22.744v90.975L21.24 85.606H0zm53.069 9.626V30.492L23.285 47.7H7.581v30.325h15.704L53.07 95.233z"
        fill="currentColor"
      />
    </svg>
  );
}

export default VolumeMute;
