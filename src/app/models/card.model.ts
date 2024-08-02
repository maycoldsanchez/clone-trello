import { List } from "./list.model";

export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  list: List
}

export interface CreateCard extends Omit<Card, 'id' | 'list'> {
  listId: number | string
  boardId: number | string
}

export interface CardDto {
  title?: string;
  description?: string;
  position?: number;
  listId?: number | string;
  boardId?: number | string;
}
