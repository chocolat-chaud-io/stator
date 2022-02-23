closes #issue_number

### Pull request creator checklist

- [ ] Add an issue closing statement in the PR description. E.g: `closes #123`
- [ ] Ensure you respect all the requirements of the issue you completed.
- [ ] `conditional` UI/UX improvements: Try to think how you would like the feature to have been build if you get into the role of the end user. E.g: when you click a button, a modal opens up, personally as a user when I press escape I would like the modal to be closed.
- [ ] Review your code as if you were reviewing someone else's code. Don't hesitate to refactor everywhere you think your code could be cleaner.
- [ ] Test thoroughly every new feature you added and try to think if your changes could have affected some other flows. E.g: you modified a generic component used in other areas; if you think it can cause issues, please test these other areas.

### Pull request reviewer checklist

- [ ] Ensure all the requirements of the issue have been implemented.
- [ ] Identify potential bugs and code improvements.
- [ ] `conditional` Identify potential UI/UX improvements.
- [ ] Test thoroughly every new feature that were added and try to think if any changes could have affected some other flows. E.g: you modified a generic component used in other areas; if you think it can cause issues, please test these other areas.
