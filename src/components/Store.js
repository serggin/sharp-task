import {action, computed, observable} from "mobx";

import {assert} from './utils';

const screens = ['LOGIN', "REGISTER", 'LOGGED', 'HISTORY', 'CREATE'];

class Store {
  @observable screen = screens[0];

  @observable showHeader = false;

  @observable showChooseModal = false;

  @observable title = "";

  @observable user = {
    name: "",
    balance: 0
  };
  @computed get balance() {
    return this.user.balance;
  }
  @observable id_token = "";

  @observable userList =[];

  @action.bound
  setScreen(screen) {
    assert(screens.indexOf(screen) >= 0, `Invali screen "${screen}"`);
    this.screen = screen;
  }

  @action.bound
  setShowHeader(show) {
    this.showHeader = show;
  }

  @action.bound
  setTitle(title) {
    this.title =title;
  }

  @action.bound
  setUser(user) {
    this.user = user;
  }

  @action.bound
  setBalance(balance) {
    this.user.balance = balance;
  }

  @action.bound
  setToken(token) {
    this.id_token = token;
  }

  @action.bound
  setUserList(userList) {
    this.userList = userList;
  }
}

export const store = new Store();
