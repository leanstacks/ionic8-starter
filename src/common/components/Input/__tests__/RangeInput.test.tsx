import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';

import { render, screen } from 'test/test-utils';

import RangeInput from '../RangeInput';

const TestForm = ({ initialValue = 0, onSubmit = () => {} }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      rangeField: initialValue,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RangeInput control={control} name="rangeField" />
    </form>
  );
};

describe('RangeInput', () => {
  it('should render successfully', async () => {
    // ARRANGE
    render(<TestForm />);
    await screen.findByTestId('input-range');

    // ASSERT
    expect(screen.getByTestId('input-range')).toBeDefined();
  });

  it.skip('should change value', async () => {
    // TODO implement test simulating user sliding range input
  });
});
