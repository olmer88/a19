module.exports = {
  /**
   * @param listId
   * @return {string}
   */
  makeListTasksUrl(listId) {
    return `/tasks/tasks-list?listId=${listId}`;
  },

  makeRoomTasksUrl(roomId) {
    return `/rooms/room?roomId=${roomId}`;
  },
};
