// This is just an example,
// so you can safely delete all default props below

export default {
  contact: 'Contact with developer: ',
  error: {
    unknown: 'Something went wrong, please try later',
    page404: 'Oops. Nothing here...',
  },
  sockets: {
    error: {
      disconnect: 'Server error! Disconnect',
      conection: "Can't connect to server",
    },
    success: 'Connected to the server',
  },
  status: {
    CREATED: 'Opened',
    ERROR: 'Error',
    PROCESSED: 'Done',
    PROCESSING: 'Reading',
    UPLOADED: 'Uploaded',
  },
  login: {
    signIn: 'Sign in',
    signInDescription: 'Sign in below to access your account',
    dontHave: "Don't have an account yet?",
    signUp: 'Sign up',
    signUpDescription: 'Create an account',
    alreadyHave: 'Already have an account?',
    email: 'Email Address',
    password: 'Password',
    repeat: 'Repeat password',
    required: 'Field is required',
    dontMatch: 'Passswords don`t match',
    wrong: 'Wrong login or password',
    success: 'You have been successfuly registered',
  },
  account: {
    new: 'Create new account',
    newDescription:
      'Collected chests will be stored on your account. Corresponds to the account in the game.',
    name: 'Account name',
    required: 'Field is required',
    create: 'Create',
    start: 'Start counting!',
    download: 'Download',
    selectDates: 'Select dates',
    currentRun: 'Current run:',
    previousRun: 'Previous run:',
    noData: 'No data',
    deleteForever: 'Delete with chests',
    deleteSoft: 'Delete session only',
    areUSure: 'Are you sure you want to delete this session?',
    areUSubSure: 'This action can`t be undone!',
    runWithOpen: 'Open chests',
    chestTooltip:
      'You can count the chests without opening them (they will remain in the account)',
  },
};
