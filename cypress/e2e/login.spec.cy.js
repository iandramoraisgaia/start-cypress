import userData from '../fixtures/user-data.json'
import LoginPage from '../pages/loginpagePage.js'
import DashboardPage from '../pages/dashboardPage.js'


const loginPage = new LoginPage()
const dashboardPage = new DashboardPage()


describe('Login Orange HRM Tests', () => {
      
  it.only('Login - Fail', () => {
    loginPage.accessLoginPage()
    loginPage.loginWithUser(userData.userFail.username, userData.userFail.password)
    loginPage.checkAcessInvalid()
  })

  it.only('Login - Success', () => {
    loginPage.accessLoginPage()
    loginPage.loginWithUser(userData.userSuccess.username, userData.userSuccess.password)
    dashboardPage.checkDashboardPage()
}) 

})