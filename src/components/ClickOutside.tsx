import * as React from 'react';

interface Props {
  onClick: () => any;
}

export default class ClickOutside extends React.PureComponent<Props> {
  private container: HTMLElement | null;
  private isTouch: boolean;

  constructor(props: Props) {
    super(props);

    this.container = null;
    this.setRef = this.setRef.bind(this);
    this.isTouch = false;
  }

  public componentDidMount() {
    document.addEventListener('touchend', this.handleClick, true);
    document.addEventListener('click', this.handleClick, true);
  }

  public componentWillUnmount() {
    document.removeEventListener('touchend', this.handleClick, true);
    document.removeEventListener('click', this.handleClick, true);
  }

  private handleClick = (event: MouseEvent | TouchEvent) => {
    if (event.type === 'touchend') {
      this.isTouch = true;
    }

    if (event.type === 'click' && this.isTouch) {
      return;
    }

    const { onClick } = this.props;
    const el = this.container;

    if (el && !el.contains(event.target as Node)) {
      onClick();
    }
  };

  private setRef(ref: HTMLElement | null) {
    this.container = ref;
  }

  public render() {
    const { children, onClick, ...props } = this.props;

    return (
      <div {...props} ref={this.setRef}>
        {children}
      </div>
    );
  }
}
