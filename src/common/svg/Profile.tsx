import React from 'react';
import { Svg } from 'expo';

export default ({ color }: { color: string }) => (
  <Svg height={24} width={24}>
    <Svg.G x={3} y={2}>
      <Svg.Path
        d="M13.5,4.49706649 C13.5,6.98094622 11.4855,8.99413299 9,8.99413299 C6.5145,8.99413299 4.5,6.98094622 4.5,4.49706649 C4.5,2.01318677 6.5145,0 9,0 C11.4855,0 13.5,2.01318677 13.5,4.49706649 Z"
        fill="none"
        strokeWidth={2}
        stroke={color}
      />
      <Svg.Path
        d="M18,20.9863103 L0,20.9863103 C0,16.8475101 3.357,13.4911995 7.5,13.4911995 L10.5,13.4911995 C14.643,13.4911995 18,16.8475101 18,20.9863103 Z"
        fill="none"
        strokeWidth={2}
        stroke={color}
      />
    </Svg.G>
  </Svg>
);
