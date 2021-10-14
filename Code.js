function createNameCard(e) {
  let email = Session
    .getActiveUser()
    .getEmail();
  let user = makeRequest(`https://www.googleapis.com/admin/directory/v1/users/${email}`);

  let addressmeas = '';
  if (user.gender && user.gender.addressMeAs) {
    addressmeas = user.gender.addressMeAs;
  }

  let newfirstname = user.name.givenName.replace(` (${addressmeas})`, '');
  let newaddressmeas = addressmeas;
  let newname;

  if (e.commonEventObject.formInputs) {
    if (e.commonEventObject.formInputs.firstname_text_input) {
      newfirstname = e
        .commonEventObject
        .formInputs
        .firstname_text_input
        .stringInputs
        .value[0]
        .trim();
    }
    if (e.commonEventObject.formInputs.addressmeas_text_input) {
      newaddressmeas = e
        .commonEventObject
        .formInputs
        .addressmeas_text_input
        .stringInputs
        .value[0];
    } else {
      newaddressmeas = '';
    }
    if (e.commonEventObject.formInputs.newname_radiobutton_field) {
      newname = e
        .commonEventObject
        .formInputs
        .newname_radiobutton_field
        .stringInputs
        .value[0];
    }
  }

  let addressmeasInput = CardService
    .newTextInput()
    .setFieldName("addressmeas_text_input")
    .setTitle("Address me as")
    .setHint("The proper way to refer to me by humans, for example \"he/him/his\" or \"they/them/their\".")
    .setValue(newaddressmeas)
    .setOnChangeAction(CardService
      .newAction()
      .setFunctionName("updateNameCard")
      .setLoadIndicator(CardService.LoadIndicator.SPINNER)
    );

  let firstnameInput = CardService
    .newTextInput()
    .setFieldName('firstname_text_input')
    .setTitle('My displayed first name')
    .setHint('')
    .setValue(newfirstname)
    .setOnChangeAction(CardService
      .newAction()
      .setFunctionName('updateNameCard')
      .setLoadIndicator(CardService.LoadIndicator.SPINNER)
    );

  let lastname = user.name.familyName.replace(` (${addressmeas})`, '');

  let lastnameText = CardService
    .newTextParagraph()
    .setText('<font color="#757575">To change your last name,'
      + ' follow <a href="<Documentation URL>">these</a>'
      + ' instructions.</font>');

  let nameWithPronounInMiddle = `${newfirstname} (${newaddressmeas}) ${lastname}`;
  let originalNameWithPronounInMiddle = `${newfirstname} (${addressmeas}) ${lastname}`;
  let nameWithPronounAtEnd = `${newfirstname} ${lastname} (${newaddressmeas})`;
  let originalNameWithPronounAtEnd = `${newfirstname} ${lastname} (${addressmeas})`;
  let nameWithoutPronoun = `${newfirstname} ${lastname}`;

  let radioGroup = CardService
    .newSelectionInput()
    .setType(CardService.SelectionInputType.RADIO_BUTTON)
    .setTitle("Display my name as")
    .setFieldName("newname_radiobutton_field")
    .setOnChangeAction(CardService
      .newAction()
      .setFunctionName("updateNameCard")
      .setLoadIndicator(CardService.LoadIndicator.SPINNER)
    );

  if (user.name.fullName === originalNameWithPronounInMiddle) {
    radioGroup
      .addItem(nameWithPronounInMiddle, nameWithPronounInMiddle, newname === nameWithPronounInMiddle ? true : false)
      .addItem(nameWithPronounAtEnd, nameWithPronounAtEnd, newname === nameWithPronounAtEnd ? true : false)
      .addItem(nameWithoutPronoun, nameWithoutPronoun, newname === nameWithoutPronoun ? true : false);
  } else if (user.name.fullName === originalNameWithPronounAtEnd) {
    radioGroup
      .addItem(nameWithPronounAtEnd, nameWithPronounAtEnd, newname === nameWithPronounAtEnd ? true : false)
      .addItem(nameWithPronounInMiddle, nameWithPronounInMiddle, newname === nameWithPronounInMiddle ? true : false)
      .addItem(nameWithoutPronoun, nameWithoutPronoun, newname === nameWithoutPronoun ? true : false);
  } else {
    radioGroup
      .addItem(nameWithoutPronoun, nameWithoutPronoun, newname === nameWithoutPronoun ? true : false)
      .addItem(nameWithPronounInMiddle, nameWithPronounInMiddle, newname === nameWithPronounInMiddle ? true : false)
      .addItem(nameWithPronounAtEnd, nameWithPronounAtEnd, newname === nameWithPronounAtEnd ? true : false);
  }

  let currentName = CardService
    .newKeyValue()
    .setTopLabel("Your name currently appears as")
    .setContent(`<b>${user.name.fullName}</b>`);

  let saveAction = CardService
    .newAction()
    .setFunctionName('updateNameCard');
  if (e.commonEventObject.formInputs || addressmeas) {
    saveAction
      .setFunctionName('onChangeName')
  }
  let saveButton = CardService
    .newTextButton()
    .setText('Next')
    .setOnClickAction(saveAction);
  if (e.commonEventObject.formInputs || addressmeas) {
    saveButton
      .setText('Save');
  }

  let cancelAction = CardService
    .newAction()
    .setFunctionName('gotoRootCard');
  let cancelButton = CardService
    .newTextButton()
    .setText('Cancel')
    .setOnClickAction(cancelAction);

  let buttonSet = CardService
    .newButtonSet()
    .addButton(saveButton)
    .addButton(cancelButton);

  // Assemble the widgets and return the card.
  let section = CardService
    .newCardSection()
    .addWidget(currentName)
    .addWidget(firstnameInput)
    .addWidget(lastnameText)
    .addWidget(addressmeasInput);
  if (e.commonEventObject.formInputs || addressmeas) {
    section
      .addWidget(radioGroup);
  }

  section
    .addWidget(buttonSet);

  let card = CardService
    .newCardBuilder()
    .setHeader(createHeader('Change your Display Name'))
    .addSection(section)
    .setFixedFooter(createFooter());

  return card.build();
}

function onChangeName(e) {
  let email = Session
    .getActiveUser()
    .getEmail();
  let user = makeRequest(`https://www.googleapis.com/admin/directory/v1/users/${email}`);

  let addressmeas = '';
  if (user.gender && user.gender.addressMeAs) {
    addressmeas = user.gender.addressMeAs;
  }

  let newfirstname = '';
  let newaddressmeas = '';

  if (e.commonEventObject.formInputs) {
    if (e.commonEventObject.formInputs.firstname_text_input) {
      newfirstname = e
        .commonEventObject
        .formInputs
        .firstname_text_input
        .stringInputs
        .value[0]
        .trim();
    }
    if (e.commonEventObject.formInputs.addressmeas_text_input) {
      newaddressmeas = e
        .commonEventObject
        .formInputs
        .addressmeas_text_input
        .stringInputs
        .value[0];
    }
  }

  let lastname = user.name.familyName.replace(` (${addressmeas})`, '');

  let nameWithPronounInMiddle = `${newfirstname} (${newaddressmeas}) ${lastname}`;
  let nameWithPronounAtEnd = `${newfirstname} ${lastname} (${newaddressmeas})`;

  let newname = e.commonEventObject.formInputs.newname_radiobutton_field.stringInputs.value[0];
  let newgivenname = newname === nameWithPronounInMiddle ? `${newfirstname} (${newaddressmeas})` : newfirstname;
  let newlastname = newname === nameWithPronounAtEnd ? `${lastname} (${newaddressmeas})` : lastname;

  console.log(`Change givenName from '${user.name.givenName}' to '${newgivenname}'`);
  console.log(`Change familyName from '${user.name.familyName}' to '${newlastname}'`);
  console.log(`Change addressMeAs from '${addressmeas}' to '${newaddressmeas}'`);

  let payload = {
    "name": {
      "givenName": newgivenname,
      "familyName": newlastname,
    },
    "gender": {
      "addressMeAs": newaddressmeas,
      "type": "unknown",
    },
  };

  let result = makeRequest(`https://www.googleapis.com/admin/directory/v1/users/${email}`, 'PUT', payload);

  let newNameText = CardService
    .newKeyValue()
    .setTopLabel("Your name will now appear as")
    .setContent(`<b>${result.name.givenName} ${result.name.familyName}</b>`);

  let gotoRootAction = CardService
    .newAction()
    .setFunctionName('gotoRootCard');
  let homeButton = CardService
    .newTextButton()
    .setText('Back to Home')
    .setOnClickAction(gotoRootAction);

  let section = CardService
    .newCardSection()
    .addWidget(newNameText)
    .addWidget(homeButton)

  let card = CardService
    .newCardBuilder()
    .setHeader(createHeader('Change your Display Name'))
    .addSection(section)
    .setFixedFooter(createFooter());

  // Create an action response that instructs the add-on to replace
  // the current card with the new one.
  let navigation = CardService
    .newNavigation()
    .updateCard(card.build());
  let actionResponse = CardService
    .newActionResponseBuilder()
    .setNavigation(navigation);

  return actionResponse.build();
}

/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
 */
function onHomepage(e) {
  let email = Session
    .getActiveUser()
    .getEmail();
  let user = makeRequest(`https://www.googleapis.com/admin/directory/v1/users/${email}`);

  let card = CardService
    .newCardBuilder()
    .setHeader(createHeader(`${user.name.fullName}, what would you like to do?`))
    .addSection(CardService
      .newCardSection()
      .addWidget(CardService
        .newTextButton()
        .setText('Change my Display Name')
        .setOnClickAction(CardService
          .newAction()
          .setFunctionName('createNameCard')
        )
      )
      // Future additional functions
      //
      // .addWidget(CardService
      //   .newTextButton()
      //   .setText('Change my Birthday visibility')
      //   .setOnClickAction(CardService
      //     .newAction()
      //     .setFunctionName('gotoRootCard')))
    )
    .setFixedFooter(createFooter());

  return card.build();
}

function createHeader(title) {
  let email = Session
    .getActiveUser()
    .getEmail();
  let user = makeRequest(`https://www.googleapis.com/admin/directory/v1/users/${email}`);

  let photoUrl = user.thumbnailPhotoUrl ?
    user.thumbnailPhotoUrl : "https://ssl.gstatic.com/s2/profiles/images/silhouette200.png";
  let cardHeader = CardService
    .newCardHeader()
    .setImageUrl(photoUrl)
    .setImageStyle(CardService.ImageStyle.CIRCLE)
    .setTitle(title);

  return cardHeader;
}

function createFooter() {
  let cardFooter = CardService
    .newFixedFooter()
    .setPrimaryButton(CardService
      .newTextButton()
      .setText('Contact the Service Desk')
      .setOpenLink(CardService
        .newOpenLink()
        .setUrl('<Service Desk URL>')
      )
    );

  return cardFooter;
}
