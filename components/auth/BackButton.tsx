import { Button } from "../Button";

type BackButtonProps = {
  handleClick: () => void;
  label: "Don't have an account?" | 'Already have an account?';
}

const BackButton = ({ handleClick, label }: BackButtonProps) => {
  return (
    <Button variant="link" onClick={handleClick}>
      {label}
    </Button>
  )
}

export default BackButton
