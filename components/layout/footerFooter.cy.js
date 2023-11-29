/* eslint-disable cypress/no-async-tests */
import Footer from './footer';

describe('<Footer />', () => {
    it('renders', async () => {

        // Note that this is a React Server Component, so we need to mock the fetch
        // Thanks https://www.youtube.com/watch?v=b9LH2gYubSo
        cy.stub(window, 'fetch').resolves({
            json: cy.stub().resolves(new Date().toISOString()),
        });
        // await the server component
        const comp = await Footer();
        // see: https://on.cypress.io/mounting-react
        cy.mount(comp);
    });
});
