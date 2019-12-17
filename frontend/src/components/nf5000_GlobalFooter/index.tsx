import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export interface GlobalFooterProps {
  links?: Array<{
    key?: string;
    title: React.ReactNode;
    href: string;
    blankTarget?: boolean;
  }>;
  copyright?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const GlobalFooter: React.SFC<GlobalFooterProps> = ({ className, links, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <footer className={clsString}>
      {copyright && <div className={styles.copyright}>{copyright}</div>}
    </footer>
  );
};

export default GlobalFooter;
