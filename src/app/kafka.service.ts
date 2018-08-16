import { environment } from './../environments/environment';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { Subscription } from '../../node_modules/rxjs';

class TopicSubscriptions {
  private ws: WebSocketSubject<any>;
  private subscriptions: Array<Subscription>;

  constructor(ws: WebSocketSubject<any>) {
    this.ws = ws;
    this.subscriptions = new Array();
  }
  subscribe(success, error, complete) {
    this.subscriptions.push(this.ws.subscribe(success, error, complete));
  }
  unsubscribe() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  sendMessage(message: any) {
    this.ws.next(message);
  }
}

@Injectable({
  providedIn: 'root'
})
export class KafkaService {

  private socketsMap: Map<String, TopicSubscriptions> = new Map();
  private kafkaApiRoot = 'kafka/topic';

  connect(topic: String, success, error, complete) {
    if (!this.socketsMap.has(topic)) {
      const socket$ = webSocket(`${environment.wsEndpoint}/${this.kafkaApiRoot}/${topic}`);
      this.socketsMap.set(topic, new TopicSubscriptions(socket$));
      console.log(this.socketsMap);
    }
    const topicSubscription = this.socketsMap.get(topic);
    topicSubscription.subscribe(success, error, complete);
  }

  disconnect(topic) {
    if (this.socketsMap.has(topic)) {
      this.socketsMap.get(topic).unsubscribe();
    }
  }

  sendMessage(topic, message) {
    if (this.socketsMap.has(topic)) {
      this.socketsMap.get(topic).sendMessage(message);
    }
  }
}
