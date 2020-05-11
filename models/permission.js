const Admin = 'Admin',
  GroupAdmin = 'GAdmin',
  GroupEditor = 'GEditor',
  GroupReporter = 'GReporter',
  GroupAdminPending = 'GAdminPending',
  GroupEditorPending = 'GEditorPending';

module.exports = {
  Admin,

  GroupAdmin,
  GroupEditor,
  GroupReporter,

  GroupAdminPending,
  GroupEditorPending,

  EditPermission: [Admin, GroupAdmin, GroupEditor],
  ViewPermission: [Admin, GroupAdmin, GroupEditor, GroupReporter]
};