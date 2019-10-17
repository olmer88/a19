const getMarks = function () {
  console.log('marks');
  const marks = Math.ceil(Math.random() * 2);
  if (marks) {
    console.log('show marks');
  }
};
const getSubjects = function () {
  console.log('subjects');
  const subjects = Math.ceil(Math.random() * 2);
  if (subjects) {
    setTimeout(getMarks, 2000);
  }
};
const getUserData = function () {
  console.log('user data');
  const userData = Math.ceil(Math.random() * 2);
  if (userData) {
    setTimeout(getSubjects, 2000);
  }
};
setTimeout(getUserData, 2000);

const userData = getUserData();
if (userData) {
  const subjects = getSubjects();
  if (subjects) {
    const marks = getMarks();
    if (marks) console.log('show marks');
  }
}

function main() {
  const userData = getUserData();
  if (!userData) return;
  const subjects = getSubjects();
  if (!subjects) return;
  const marks = getMarks();
  if (!marks) return;
  console.log('show marks');
}
