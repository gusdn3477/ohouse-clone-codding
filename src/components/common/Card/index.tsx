import CardRoot from './CardRoot';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

export default Card;
export { CardRoot, CardHeader, CardBody, CardFooter };
