import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'nguix-dashboard-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss']
})
export class HtmlEditorComponent implements OnInit {
  @Input() htmlContent?: string = '';
  @Output() save = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  ready(e: any) {
    e.on('Change', () => this.save.emit(this.htmlContent));
  }
}
