import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-someother',
  template: `
    <p>
      someother works!
    </p>
  `,
  styleUrls: ['./someother.component.css']
})
export class SomeotherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
