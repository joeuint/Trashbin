import { it } from 'vitest'
import { render } from '@testing-library/svelte'
import Navbar__SvelteComponent_ from './Navbar.svelte'

it('Displays a navbar', () => {
    const { getByText } = render(Navbar__SvelteComponent_)
    
    getByText('Home')
    getByText('ToS')
    getByText('About')
})