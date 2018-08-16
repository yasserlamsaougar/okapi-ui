import { Component } from '@angular/core';
import { KafkaService } from './kafka.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'okapi-ui';
  constructor(kafkaService: KafkaService) {
    kafkaService.connect('test',
    (msg) => console.log(msg),
    (err) => console.error(err),
    () => console.log('complete'));
    kafkaService.sendMessage('test', {
      message: 'Fuck you son of a bitch'
    });
  }
}
