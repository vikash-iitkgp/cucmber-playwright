Feature: Book Store Application

  Scenario: Verify Login Workflow with Multiple Credentials
    Given I navigate to the Book Store
    When I attempt to login with multiple credentials
    Then I should see the logout button if login is successful
    And I should see the login button if login fails

  Scenario: Add a new record to WebTable
    Given I navigate to the WebTable page
    When I add new records to the WebTable

  Scenario: Upload and Download File
    Given I navigate to the Upload Download page
    When I upload a file
    Then I should see the uploaded file path
    When I download a file
    Then I should see the downloaded file path

  Scenario: Verify new Tab functionality
    Given I navigate to the Browser Window page
    When I open a new tab
    Then I should verify the content of the new tab

  Scenario: Verify new Window functionality
    Given I navigate to the Browser Window page
    When I open a new window
    Then I should verify the content of the new window

  Scenario: Verify Message Window functionality
    Given I navigate to the Browser Window page
    When I open a new message window
    Then I should verify the content of the message window