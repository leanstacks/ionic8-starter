import { PropsWithChildren, useState } from 'react';
import { ScrollCustomEvent } from '@ionic/core';

import { ScrollContext, ScrollContextValue, ScrollDirection } from './ScrollContext';

/**
 * The `ScrollProvider` component creates and provides access to the `ScrollContext`
 * value. Provides information regarding scroll events.
 *
 * Useful when integrated with scroll events emitted by components such as `IonContent`.
 *
 * *Example:*
 * ```
 * const { handleIonScroll, scrollDirection } = useScrollContext();
 * ...
 * <IonContent scrollEvents onIonScroll={handleIonScroll}>
 *   <IonText className={classNames('ion-hide', scrollDirection==='down')}>
 *     I am hidden when scrolling down!
 *   </IonText>
 * </IonContent>
 * ```
 * @param {PropsWithChildren} props - Component properties.
 */
const ScrollProvider = ({ children }: PropsWithChildren) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection | undefined>(undefined);

  const handleIonScroll = (event: ScrollCustomEvent) => {
    const { currentY, startY } = event.detail;
    const scrollY = currentY - startY;
    if (scrollY > 0) {
      setScrollDirection('down');
    } else if (scrollY < 0) {
      setScrollDirection('up');
    }
  };

  const contextValue: ScrollContextValue = {
    scrollDirection: scrollDirection,
    handleIonScroll: handleIonScroll,
  };

  return <ScrollContext.Provider value={contextValue}>{children}</ScrollContext.Provider>;
};

export default ScrollProvider;
