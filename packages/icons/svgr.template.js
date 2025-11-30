export const template = ({ componentName, props, jsx }, { tpl }) => {
  return tpl`
  import type { SVGProps } from 'react';

  const ${componentName} = (${props}) => ${jsx};

  export default ${componentName};
  ${componentName}.displayName = '${componentName.replace(/^Svg/, "")}';
  `;
};
