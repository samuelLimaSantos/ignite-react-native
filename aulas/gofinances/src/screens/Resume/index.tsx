import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/core';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  Month,
  MonthSelectIcon,
} from './styles';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface TotalCategory {
  key: string;
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [ selectedDate, setSelectedDate] = useState(new Date());
  const [ totalByCategories, setTotalByCategories ] = useState<TotalCategory[]>([]);
  const theme = useTheme();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      return setSelectedDate(addMonths(selectedDate, 1));
    }

    return setSelectedDate(subMonths(selectedDate, 1));
  }

  async function loadData() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expenses = responseFormatted
      .filter((expensive: TransactionData) => 
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear() 
      );

    const expensesTotal = expenses.reduce((total: number, expense: TransactionData) => {
      return total + Number(expense.amount);
    }, 0);
    
    const totalByCategory: Array<TotalCategory> = [];

    categories.forEach(category => {
      let categorySum = 0;

      expenses.forEach((expense: TransactionData) => {
        if (expense.category === category.key) {
          categorySum += +expense.amount;
        }
      });

      
      if (categorySum > 0) {

        const totalFormatted = categorySum.toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${(categorySum / expensesTotal * 100).toFixed(0)}%`;


        totalByCategory.push({
          name: category.name,
          color: category.color,
          key: category.key,
          totalFormatted,
          total: categorySum,
          percent,
        });
      }

    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [selectedDate])
  ) 

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      
      <Content
        style={{
          paddingBottom: useBottomTabBarHeight(),
        }}
      >

        <MonthSelect>
          <MonthSelectButton
            onPress={() => handleDateChange('prev')}
          >
            <MonthSelectIcon name="chevron-left"/>
          </MonthSelectButton>

          <Month>{ format(selectedDate, 'MMMM, yyyy', {locale: ptBR} ) }</Month>

          <MonthSelectButton
            onPress={() => handleDateChange('next')}
          >
            <MonthSelectIcon name="chevron-right"/>
          </MonthSelectButton>

        </MonthSelect>

        <ChartContainer>
          <VictoryPie 
            data={totalByCategories}
            x="percent"
            y="total"
            colorScale={totalByCategories.map(category => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape
              }
            }}
            labelRadius={50}
          />
        </ChartContainer>

        {totalByCategories.map(item => (
          <HistoryCard 
            title={item.name}
            amount={item.totalFormatted}
            color={item.color}
            key={item.key}
          />
        ))}
      </Content>
    </Container>
  )
}