/**
 *  Return to the initial add-on card.
 *  @return {ActionResponse}
 */
function gotoRootCard() {
  var nav = CardService
    .newNavigation()
    .popToRoot();
  return CardService
    .newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}

function updateNameCard(e) {
  var nav = CardService
    .newNavigation()
    .updateCard(createNameCard(e));
  return CardService
    .newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}
