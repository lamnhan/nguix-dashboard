import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as Croppie from 'croppie';

@Component({
  selector: 'image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ImageCropperComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('cropper', {static: true}) private cropperRef?: ElementRef;

  /**
   * Input() The image url
   */
  @Input() url!: string;

  /**
   * Input() Croppie options
   */
  @Input() options!: Croppie.CroppieOptions;

  /**
   * Input() Result options
   */
  @Input() resultOptions?: Croppie.ResultOptions;

  /**
   * Output() On cropping changes
   */
  @Output() change = new EventEmitter<Blob>();

  private croppieInstance?: Croppie;
  private croppingSubscription?: Subscription;

  constructor() {}

  /**
   * @ignore
   */
  ngOnInit(): void {}

  /**
   * @ignore
   */
  ngOnChanges(): void {
    if (this.cropperRef && this.url) {
      const el = this.cropperRef.nativeElement;
      // clear if exists
      this.croppieInstance?.destroy();
      // new instance
      const croppie = new Croppie(el, this.options);
      croppie.bind({ url: this.url });
      // watch for changes
      this.croppingSubscription = fromEvent(el, 'update')
        .pipe(debounceTime(500))
        .subscribe(() => this.onChanges());
      // re-assign instance
      this.croppieInstance = croppie;
    }
  }

  /**
   * @ignore
   */
  ngOnDestroy(): void {
    if (this.croppingSubscription) {
      this.croppingSubscription.unsubscribe();
    }
    if (this.croppieInstance) {
      this.croppieInstance.destroy();
    }
  }

  /**
   * @ignore
   */
  onChanges() {
    this.croppieInstance?.result({
      type: 'blob',
      format: 'jpeg',
      quality: 0.6,
      ...this.resultOptions
    })
    .then(blob => this.change.emit(blob as unknown as Blob));
  }
}
