import * as todoAction from './todos.actions';

describe('Todos Actions', () => {
  describe('TodosAdd', () => {
    it('should create an action', () => {
      const action = todoAction.actionTodosAdd('test', null, 0);
      expect(action.name).toEqual('test');
      expect(action.type).toEqual(todoAction.actionTodosAdd.type);
    });
  });

  describe('ActionTodosToggle', () => {
    it('should create an action', () => {
      const action = todoAction.actionTodosToggle({ id: '1', done: true });

      expect({ ...action }).toEqual({
        type: todoAction.actionTodosToggle.type,
        id: '1',
        done: true
      });
    });
  });

  describe('ActionTodosRemoveDone', () => {
    it('should create an action', () => {
      const action = todoAction.actionTodosRemoveDone();

      expect({ ...action }).toEqual({
        type: todoAction.actionTodosRemoveDone.type
      });
    });
  });

  describe('ActionTodosFilter', () => {
    it('should create an action', () => {
      const action = todoAction.actionTodosFilter({ filter: 'DONE' });

      expect({ ...action }).toEqual({
        type: todoAction.actionTodosFilter.type,
        filter: 'DONE'
      });
    });
  });
});
