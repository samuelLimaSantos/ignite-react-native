import React, { useState } from 'react';
import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelect } from '../../components/Forms/CategorySelect';
import { 
  Container,
  Header, 
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';


export function Register() {

  const [transactionType, setTransactionType] = useState('');

  function handleTransactionTypeSelect(transactionType: 'up' | 'down') {
    setTransactionType(transactionType);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input 
            placeholder="Nome"
          />

          <Input 
            placeholder="Preço"
          />

          <TransactionsTypes>
            <TransactionTypeButton 
              type="up"
              title="Income"
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />

            <TransactionTypeButton 
              type="down"
              title="Outcome"
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>

          <CategorySelect title="Categoria" />
        </Fields>

        <Button 
          title="Enviar"
        />
      </Form>
    </Container>  
  )
}