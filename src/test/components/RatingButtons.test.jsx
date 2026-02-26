import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingButtons from '../../components/review/RatingButtons';

describe('RatingButtons', () => {
    it('renders all four rating buttons', () => {
        render(<RatingButtons onRate={() => { }} />);
        expect(screen.getByText('Forgot'), '"Forgot" button should be present').toBeInTheDocument();
        expect(screen.getByText('Hard'), '"Hard" button should be present').toBeInTheDocument();
        expect(screen.getByText('Good'), '"Good" button should be present').toBeInTheDocument();
        expect(screen.getByText('Easy'), '"Easy" button should be present').toBeInTheDocument();
    });

    it('calls onRate with 0 when "Forgot" is clicked', async () => {
        const onRate = vi.fn();
        render(<RatingButtons onRate={onRate} />);
        await userEvent.click(screen.getByText('Forgot'));
        expect(onRate, 'Forgot should pass quality score 0').toHaveBeenCalledWith(0);
        expect(onRate, 'should only fire once per click').toHaveBeenCalledTimes(1);
    });

    it('calls onRate with 1 when "Hard" is clicked', async () => {
        const onRate = vi.fn();
        render(<RatingButtons onRate={onRate} />);
        await userEvent.click(screen.getByText('Hard'));
        expect(onRate, 'Hard should pass quality score 1').toHaveBeenCalledWith(1);
    });

    it('calls onRate with 2 when "Good" is clicked', async () => {
        const onRate = vi.fn();
        render(<RatingButtons onRate={onRate} />);
        await userEvent.click(screen.getByText('Good'));
        expect(onRate, 'Good should pass quality score 2').toHaveBeenCalledWith(2);
    });

    it('calls onRate with 3 when "Easy" is clicked', async () => {
        const onRate = vi.fn();
        render(<RatingButtons onRate={onRate} />);
        await userEvent.click(screen.getByText('Easy'));
        expect(onRate, 'Easy should pass quality score 3').toHaveBeenCalledWith(3);
    });

    it('does not call onRate until a button is clicked', () => {
        const onRate = vi.fn();
        render(<RatingButtons onRate={onRate} />);
        expect(onRate, 'onRate should not fire just from rendering the component').not.toHaveBeenCalled();
    });

    it('renders buttons in Forgot → Hard → Good → Easy order', () => {
        render(<RatingButtons onRate={() => { }} />);
        const buttons = screen.getAllByRole('button');
        expect(
            buttons.map(b => b.textContent),
            'buttons should appear in ascending quality order: Forgot(0), Hard(1), Good(2), Easy(3)'
        ).toEqual(['Forgot', 'Hard', 'Good', 'Easy']);
    });
});
