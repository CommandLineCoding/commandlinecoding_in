import { Component } from '@angular/core';

@Component({
  selector: 'app-protocols',
  standalone: true,
  imports: [],
  templateUrl: './protocols.html',
  styleUrl: './protocols.scss'
})
export default class Protocols {
  indexItems = [
    { anchor: 'name', label: 'NAME' },
    { anchor: 'synopsis', label: 'SYNOPSIS' },
    { anchor: 'description', label: 'DESCRIPTION' },
    { anchor: 'conduct', label: 'CODE OF CONDUCT' },
    { anchor: 'contribution', label: 'CONTRIBUTION GUIDELINES' },
    { anchor: 'done', label: 'DEFINITION OF DONE' },
    { anchor: 'see-also', label: 'SEE ALSO' }
  ];

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}