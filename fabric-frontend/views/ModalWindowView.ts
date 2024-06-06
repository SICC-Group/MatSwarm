const $ = require('jquery');
import * as django from 'django';
import './ModalWindowView.scss';

export enum Effect {
  FadeInAndScale = 1,
  SlideInFromRight,
  SlideInFromBottom,
  StickyUp  = 7,
}

export class ModalWindowViewConfig {
  public clickOverlayToClose: boolean;
  public content: JQuery<HTMLElement>;
  public effect: Effect;
  public blur: boolean;
}

/**
 * 用户构造内容的jQuery传递给ModalView
 * 然后调用GetView方法获得Modal的jQuery对象加入到DOM树
 * 最后在符合条件情况下调用Show显示它
 * ModalWindow是自管理的，不需要用户手动把它加入到某个对象中
 */
const overlay = $('<div class="md-overlay"></div>');

export class BaseModalWindowView{
  protected view: JQuery<HTMLElement>;
  private readonly config: ModalWindowViewConfig;
  private isShown: boolean;
  constructor(config: ModalWindowViewConfig){
    this.config = config;
    this.isShown = false;
    this.view = $(
      `<div class="md-modal md-effect-${this.config.effect} ${this.config.blur ? 'md-effect-blur' : ''}">
        <div class="md-content"></div>
      </div>`);
    this.view.find('.md-content').append(config.content);

    if ($('body').find('.md-overlay').length === 0) {
      $('body').append(overlay);
    }
    
  }

  /**
   * 显示模态窗口
   */
  public Show(): void {
    this.isShown = true;
    if (this.config.clickOverlayToClose) {
      this.view.unbind('click').click(() => {
        this.Hide();
      });
      this.view.find('.md-content').unbind('click').click((event) => {
        event.stopPropagation();
      });
    }
    $('body').prepend(this.view);
    setTimeout(() => { this.view.addClass('md-show'); }, 100);
    // this.view.addClass('md-show');
  }

  /**
   * 隐藏模态窗口
   */
  public Hide(anim?: boolean): void {
    this.isShown = false;
    this.view.removeClass('md-show');
    if (anim) {
      if (!this.isShown) {
        this.view.detach();
      }
      return;
    }
    this.isShown = false;
    this.view.removeClass('md-show');
    setTimeout(() => { 
      if (!this.isShown) {
        this.view.detach();
      } 
    }, 1500);
  }

  /**
   * 从页面中删除
   */
  public Remove(): void {
    this.view.remove();
  }
}

export enum MgeModalType {
  Info, Warn, Error,
}

export interface MgeModalConfig {
  title?: string;
  // type: MgeModalType; // currently not used
  content?: JQuery<HTMLElement>;
  clickOverlayToClose: boolean;
  onClickOK?: () => boolean;
}

export class MgeModalWindow extends BaseModalWindowView {
  protected readonly mgeConfig: MgeModalConfig;
  constructor(config: MgeModalConfig) {
    const title = config.title || django.gettext('Info');
    const content = $(`
    <div class="modal-header">
      <h4 class="modal-title">${title}</h4>
    </div>
    <div id="modal-content" class="modal-body">
    </div>
    <div class="modal-footer">
      <button id="close" type="button" class="btn btn-primary">${django.gettext('OK')}</button>
    </div>`);
    if (config.content){
      content.filter('#modal-content').append(config.content);
    }

    content.find('#close').click(() => {
      if (this.mgeConfig.onClickOK) {
        const ret = this.mgeConfig.onClickOK();
        if (ret) {
          this.Hide();
        }
        return;
      }
      this.Hide();
    });

    super({ 
      effect: Effect.FadeInAndScale, 
      clickOverlayToClose: config.clickOverlayToClose, 
      content, blur: false });
    
    this.mgeConfig = config;
  }

  public setContent(content: JQuery<HTMLElement>): void {
    this.view.find('#modal-content').empty().append(content);
  }

  public setOnClickOK(onClickOK: () => boolean) {
    this.mgeConfig.onClickOK = onClickOK;
  }

  public setTitle(title: string) {
    this.view.find('.modal-title').text(title);
  }

  public setOKButtonText(text: string) {
    this.view.find('#close').text(text);
  }

  public HideTitle(): void {
    this.view.find('.modal-header').css('display', 'none');
  }

  public ShowTitle(): void {
    this.view.find('.modal-header').css('display', 'block');
  }

  public HideFooter(): void {
    this.view.find('.modal-footer').addClass('hide');
  }

  public ShowFooter(): void {
    this.view.find('.modal-footer').removeClass('hide');
  }
}
