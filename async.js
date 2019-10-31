// const getMarks = function () {
//   console.log('marks');
//   const marks = Math.ceil(Math.random() * 2);
//   if (marks) {
//     console.log('show marks');
//   }
// };
// const getSubjects = function () {
//   console.log('subjects');
//   const subjects = Math.ceil(Math.random() * 2);
//   if (subjects) {
//     setTimeout(getMarks, 2000);
//   }
// };

const getRandomBoolean = () => Boolean(Math.round(Math.random()));

const getUserData = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('in setTimeout');
      if (getRandomBoolean()) {
        resolve({ name: 'Max', id: 123 });
      } else {
        reject(new Error('Oh, no!'));
      }
    }, 1000);
  });
};
//
// setTimeout(getUserData, 2000);
//
// const userData = getUserData();
// if (userData) {
//   const subjects = getSubjects();
//   if (subjects) {
//     const marks = getMarks();
//     if (marks) console.log('show marks');
//   }
// }
//
// function main() {
//   const userData = getUserData();
//   if (!userData) return;
//   const subjects = getSubjects();
//   if (!subjects) return;
//   const marks = getMarks();
//   if (!marks) return;
//   console.log('show marks');
// }

const getSubjects = (id) => {
  console.log('id', id);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { name: 'Math' },
        { name: 'English' },
      ]);
    }, 500);
  });
};
const getMarks = (subjects) => {
  return new Promise(resolve => {
    resolve([
      { name: 'Math', marks: [3, 4, 5] },
      { name: 'English', marks: [5, 5, 5] },
    ]);
  }, 232);
};

function main() {
  getUserData()
    .then(userData => {
      console.log('userData', userData);
      return userData.id;
    })
    .then(getSubjects)
    .then((subjects) => {
      console.log('subjects', subjects);
      return subjects;
    })
    .then(getMarks)
    .then(console.log)
    .catch(err => {
      console.log('caught', err);
    });
}

main();
