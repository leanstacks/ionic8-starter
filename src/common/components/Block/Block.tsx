import { ReactNode } from 'react';
import classNames from 'classnames';

import './Block.scss';
import { BaseComponentProps } from '../types';

/**
 * Properties for the `Block`component.
 * @param {ReactNode} [content] - The content of the block.
 * @param {string} [title] - The title of the block.
 * @see {@link BaseComponentProps}
 */
interface BlockProps extends BaseComponentProps {
  content?: ReactNode;
  title?: string;
}

/**
 * The `Block` component renders a section of content. Similar to an `IonCard`
 * but does not render the border and shadow.
 * @param {BlockProps} props - Component properties.
 * @returns JSX
 */
const Block = ({ className, content, testid = 'block', title }: BlockProps) => {
  return (
    <div className={classNames('ls-block', className)} data-testid={testid}>
      {title && (
        <div className="ls-block__title" data-testid={`${testid}-title`}>
          {title}
        </div>
      )}
      {content && (
        <div className="ls-block__content" data-testid={`${testid}-content`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Block;
